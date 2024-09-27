using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiHospital.Data;
using ApiHospital.Models;
using AutoMapper;
using hospitalDTO.DTOapi;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiHospital.Controllers
{
    [Route("api/Rooms")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly HospitalContext _context;

        private readonly IMapper _mapper;

        public RoomController(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Room
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms(
            [FromQuery] int? RoomNumber = null,
            [FromQuery] int? Capacity = null,
            [FromQuery] string? Area = null,
            [FromQuery] int? Floor = null,
            [FromQuery] bool? Availability = null,
            [FromQuery] int? BedId = null
        )
        {
            IQueryable<Room> query = _context.Rooms.Include(room => room.Beds);

            if (RoomNumber.HasValue)
            {
                query = query.Where(r => r.RoomNumber == RoomNumber.Value);
            }

            if (Capacity.HasValue)
            {
                query = query.Where(r => r.Capacity == Capacity.Value);
            }

            if (!string.IsNullOrEmpty(Area))
            {
                query = query.Where(r => r.Area.StartsWith(Area));
            }

            if (Floor.HasValue)
            {
                query = query.Where(r => r.Floor == Floor.Value);
            }

            if (Availability.HasValue)
            {
                query = query.Where(r => r.Availability == Availability.Value);
            }

            if (BedId.HasValue)
            {
                return Ok(query.ToList());
                /*query = from room in query
                        join bed in _context.Beds on room.Id equals bed.RoomId
                        where bed.Id == BedId.Value
                        select room;*/

                //query = query.Where(r => r.Beds.Any(b => b.Id == BedId.Value));
            }

            return await query.ToListAsync();
        }

        // GET: api/Room/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context
                .Rooms.Include(Room => Room.Beds)
                .Where(Room => Room.Id == id)
                .FirstOrDefaultAsync();

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        // PUT: api/Room/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, RoomDTO roomDTO)
        {
            if (id != roomDTO.Id)
            {
                return BadRequest();
            }

            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
                return NotFound();

            _mapper.Map(roomDTO, room);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Room
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(RoomDTO roomDTO)
        {
            var room = _mapper.Map<Room>(roomDTO);
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Created($"/rooms/{room.Id}", room);
        }

        // DELETE: api/Room/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Rooms/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchRoom(
            int id,
            [FromBody] JsonPatchDocument<Room> patchDocument
        )
        {
            if (patchDocument == null)
                return BadRequest();

            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
                return NotFound();

            patchDocument.ApplyTo(room, ModelState);

            bool isValidPatch = TryValidateModel(room);

            if (!isValidPatch)
                return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
