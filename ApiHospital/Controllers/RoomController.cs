using ApiHospital.Hubs;
using ApiHospital.Models;
using ApiHospital.Service;
using hospitalDTO.DTOapi;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ApiHospital.Controllers
{   

    [Route("api/Rooms")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly RoomService _service;
        private readonly IHubContext<HospitalHub> _hubContext;

        public RoomController(RoomService service, IHubContext<HospitalHub> hubContext)
        {
            _service = service;
            _hubContext = hubContext;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetAllRooms(
            [FromQuery] int? RoomNumber = null,
            [FromQuery] int? Capacity = null,
            [FromQuery] string? Zone = null,
            [FromQuery] string? Area = null,
            [FromQuery] int? Floor = null,
            [FromQuery] bool? Availability = null,
            [FromQuery] int? BedId = null,
            [FromQuery] int?[] Hospital = null
        )
        {
            
            IQueryable<Room> query = _service.GetRooms(
                RoomNumber,
                Capacity,
                Zone,
                Area,
                Floor,
                Availability,
                BedId,
                Hospital
            );

            return await query.ToListAsync();
        }


        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _service.GetRoomById(id);

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        // GET: api/Rooms/exists/101
        [HttpGet("exists/{roomNumber}")]
        public async Task<IActionResult> RoomExistsByNumber(int roomNumber,
            [FromQuery] int? hospital = null)
        {
            return Ok(await _service.RoomNumberExists(roomNumber, hospital));

        }

        // PUT: api/Rooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, RoomDTO roomDTO)
        {
            if (id != roomDTO.Id)
            {
                return BadRequest();
            }

            var room = await _service.GetRoomById(id);
            if (room == null)
            {
                return NotFound();
            }

            var updated = await _service.UpdateRoom(roomDTO, room);

            if (updated) {
                return NoContent();
            } else {
                return NotFound();
            }
            
        }

        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(RoomDTO roomDTO)
        {
            if (await _service.RoomNumberExists(roomDTO.RoomNumber, roomDTO.Hospital))
            {
                return BadRequest("Room number already exists.");
            }

            var room = await _service.CreateRoom(roomDTO);

            await _hubContext.Clients.All.SendAsync("TableUpdated", "Rooms");

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room);
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _service.GetRoomById(id);

            if (room == null) return NotFound();

            if (await _service.RoomHasBeds(room)) return BadRequest();
            
            await _service.DeleteRoom(room);

            await _hubContext.Clients.All.SendAsync("TableUpdated", "Patients");
            
            return NoContent();
        }
        // PUT: api/Room/undo/5
        [HttpGet("undo/{id}")]
        public async Task<IActionResult> UndoDeletePatient(int id) {

            var room = await _service.GetDeletedRoomById(id);

            if (room == null)
                return NotFound();
            
            var updated = await _service.UndoDeleteRoom(room);
            
            if (updated) {
                return Ok(room);
            } else {
                return NotFound();
            }
        }

    }
}