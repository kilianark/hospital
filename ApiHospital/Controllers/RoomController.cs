using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
            IQueryable<Room> query = _context.Rooms;
            
            query = ApplyFilter(query, RoomNumber, r => r.RoomNumber == RoomNumber!.Value);
            query = ApplyFilter(query, Capacity, r => r.Capacity == Capacity);
            query = ApplyFilter(query, Zone, r => !string.IsNullOrWhiteSpace(Zone) && r.Zone.ToLower().StartsWith(Zone.ToLower()));
            query = ApplyFilter(query, Area, r => !string.IsNullOrWhiteSpace(Area) && r.Area.ToLower().StartsWith(Area.ToLower())); // Cambié Surname1 a Area
            query = ApplyFilter(query, Floor, r => r.Floor == Floor);
            query = ApplyFilter(query, Availability, r => r.Availability == Availability);
            query = ApplyFilter(query, BedId, r => r.Beds.Any(b => b.Id == BedId));
            query = ApplyFilter(query, Hospital, r => Hospital.Contains(r.Hospital));

            return await query.ToListAsync();
        }

        private IQueryable<T> ApplyFilter<T>(
            IQueryable<T> query,
            object? filterValue,
            Expression<Func<T, bool>> filterExpression
        )
        {
            if (filterValue != null)
            {
                query = query.Where(filterExpression);
            }

            return query;
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context
                .Rooms.Include(r => r.Beds)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        // GET: api/Rooms/exists/101
        [HttpGet("exists/{roomNumber}")]
        public async Task<IActionResult> RoomExistsByNumber(int roomNumber)
        {
            var exists = await _context.Rooms.AnyAsync(r => r.RoomNumber == roomNumber);
            return Ok(exists);
        }

        // PUT: api/Rooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, RoomDTO roomDTO)
        {
            if (id != roomDTO.Id)
            {
                return BadRequest();
            }

            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

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

        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(RoomDTO roomDTO)
        {
            if (await _context.Rooms.AnyAsync(r => r.RoomNumber == roomDTO.RoomNumber))
            {
                return BadRequest("Room number already exists.");
            }

            var room = _mapper.Map<Room>(roomDTO);
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room);
        }

        // DELETE: api/Rooms/5
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
            {
                return BadRequest();
            }

            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            patchDocument.ApplyTo(room, ModelState);

            if (!TryValidateModel(room))
            {
                return BadRequest(ModelState);
            }

            await _context.SaveChangesAsync();

            return Ok(room);
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}