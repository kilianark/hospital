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
    [Route("api/Moves")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public MoveController(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Moves
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MoveDTO>>> GetAllMoves(
            [FromQuery] int? id = null,
            [FromQuery] int? PatientId = null,
            [FromQuery] int? Hospital_CodeO = null,
            [FromQuery] int? Hospital_CodeD = null,
            [FromQuery] DateTime? Date = null)
        {
            IQueryable<Move> query = _context.Moves;

            query = ApplyFilter(query, id, m => m.Id == id!.Value);
            query = ApplyFilter(query, PatientId, m => m.Patient_id == PatientId.Value);
            query = ApplyFilter(query, Hospital_CodeO, m => m.Hospital_codeO == Hospital_CodeO!.Value);
            query = ApplyFilter(query, Hospital_CodeD, m => m.Hospital_codeD == Hospital_CodeD!.Value);
            query = ApplyFilter(query, Date, m => m.Date.Date == Date.Value.Date);

            var result = await query.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<MoveDTO>>(result));
        }

        private IQueryable<T> ApplyFilter<T>(
            IQueryable<T> query,
            object? filterValue,
            Expression<Func<T, bool>> filterExpression)
        {
            if (filterValue != null)
            {
                query = query.Where(filterExpression);
            }
            return query;
        }

        // GET: api/Moves/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MoveDTO>> GetMove(int id)
        {
            var move = await _context.Moves.FirstOrDefaultAsync(c => c.Id == id);
            if (move == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<MoveDTO>(move));
        }

        // PUT: api/Moves/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMove(int id, MoveDTO moveDTO)
        {
            if (id != moveDTO.Id)
            {
                return BadRequest();
            }

            var move = await _context.Moves.FindAsync(id);
            if (move == null)
            {
                return NotFound();
            }

            _mapper.Map(moveDTO, move);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MoveExists(id))
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

        // POST: api/Moves
        [HttpPost]
        public async Task<ActionResult<MoveDTO>> PostMove(MoveDTO moveDTO)
        {
            // No check for Move ID; instead, ensure it is unique based on business rules if needed
            var move = _mapper.Map<Move>(moveDTO);
            _context.Moves.Add(move);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMove), new { id = move.Id }, _mapper.Map<MoveDTO>(move));
        }

        // DELETE: api/Moves/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMove(int id)
        {
            var move = await _context.Moves.FindAsync(id);
            if (move == null)
            {
                return NotFound();
            }

            _context.Moves.Remove(move);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/Moves/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchMove(int id, [FromBody] JsonPatchDocument<MoveDTO> patchDocument)
        {
            if (patchDocument == null)
            {
                return BadRequest();
            }

            var move = await _context.Moves.FindAsync(id);
            if (move == null)
            {
                return NotFound();
            }

            var moveDTO = _mapper.Map<MoveDTO>(move);
            patchDocument.ApplyTo(moveDTO, ModelState);

            if (!TryValidateModel(moveDTO))
            {
                return BadRequest(ModelState);
            }

            _mapper.Map(moveDTO, move);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<MoveDTO>(move));
        }

        private bool MoveExists(int id)
        {
            return _context.Moves.Any(e => e.Id == id);
        }
    }
}