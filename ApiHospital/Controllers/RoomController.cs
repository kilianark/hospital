using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiHospital.Data;
using ApiHospital.Models;
using hospitalDTO.DTOapi;
using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;

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
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            return await _context.Rooms
            .Include(Room => Room.Beds)
            .ThenInclude(beds => (beds as Bed)
            .Patient).ToListAsync();
        }

        // GET: api/Room/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context.Rooms.Include(Room => Room.Beds).Where(Room => Room.Id == id).FirstOrDefaultAsync();

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
            if (room == null) return NotFound();


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
        public async Task<IActionResult> PatchRoom(int id, [FromBody] JsonPatchDocument<Room> patchDocument)
        {
            if (patchDocument == null) return BadRequest();

            var room = await _context.Rooms.FindAsync(id);

            if (room == null) return NotFound();

            patchDocument.ApplyTo(room, ModelState);

            bool isValidPatch = TryValidateModel(room);

            if (!isValidPatch) return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok();
    
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
