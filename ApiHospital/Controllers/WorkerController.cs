using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;
using ApiHospital.Data;
using ApiHospital.Models;
using AutoMapper;
using hospitalDTO.DTOapi;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ApiHospital.Service;

namespace ApiHospital.Controllers
{
    [Route("api/Workers")]
    [ApiController]
    public class WorkerController : ControllerBase
    {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        private readonly WorkerService _service;

        public WorkerController(HospitalContext context, IMapper mapper, WorkerService service)
        {
            _mapper = mapper;
            _context = context;
            _service = service;
        }

        // GET: api/Workers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worker>>> GetWorkers(
            [FromQuery] string? WorkerCode = null,
            [FromQuery] string? Name = null,
            [FromQuery] string? Surname1 = null,
            [FromQuery] string? Surname2 = null,
            [FromQuery] string? Dni = null,
            [FromQuery] string? Cip = null,
            [FromQuery] string? Phone = null,
            [FromQuery] int? Hospital = null
        )
        {
            IQueryable<Worker> query = _context.Workers;

            // Aplica los filtros usando el método helper 'ApplyFilter'
            query = ApplyFilter(query, WorkerCode, w => !string.IsNullOrWhiteSpace(WorkerCode) && w.WorkerCode.ToLower().StartsWith(WorkerCode.ToLower()));
            query = ApplyFilter(query, Name, w => !string.IsNullOrWhiteSpace(Name) && w.Name.ToLower().StartsWith(Name.ToLower()));
            query = ApplyFilter(query, Surname1, w => !string.IsNullOrWhiteSpace(Surname1) && w.Surname1.ToLower().StartsWith(Surname1.ToLower()));
            query = ApplyFilter(query, Surname2, w => !string.IsNullOrWhiteSpace(Surname2) && w.Surname2.ToLower().StartsWith(Surname2.ToLower()));
            query = ApplyFilter(query, Dni, w => !string.IsNullOrWhiteSpace(Dni) && w.Dni.ToLower().StartsWith(Dni.ToLower()));
            query = ApplyFilter(query, Cip, w => !string.IsNullOrWhiteSpace(Cip) && w.CIP.ToLower().StartsWith(Cip.ToLower()));
            query = ApplyFilter(query, Phone, w => !string.IsNullOrWhiteSpace(Phone) && w.Phone.ToLower().StartsWith(Phone.ToLower()));
            query = ApplyFilter(query, Hospital, w => w.Hospital == Hospital!.Value);
            // Mapea los nombres de hospitales a sus abreviaturas

            // Ejecuta la consulta y retorna el resultado
            var workers = await query.ToListAsync();

            if (!workers.Any())
            {
                return NotFound("No se han encontrado trabajadores que coincidan con los criterios de búsqueda.");
            }

            return Ok(workers);
        }

        // Método helper para aplicar filtros de forma condicional
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



        // GET: api/Worker/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetWorker(int id)
        {
            var worker = await _context.Workers.FindAsync(id);

            if (worker == null)
                return NotFound();

            return worker;
        }

        // PUT: api/Worker/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorker(int id, WorkerDTO workerDTO)
        {
            var worker = await _context.Workers.FindAsync(id);

            if (worker == null)
                return NotFound();

            _mapper.Map(workerDTO, worker);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkerExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/Worker
        [HttpPost]
        public async Task<ActionResult<Worker>> PostWorker(Worker worker)
        {
            _context.Workers.Add(worker);
            await _context.SaveChangesAsync();

            return Created($"/Workers/{worker.Id}", worker);
        }

        // DELETE: api/Worker/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorker(int id)
        {
            var worker = await _context.Workers.FindAsync(id);

            if (worker == null)
                return NotFound();
                
            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Worker/undo/5
        [HttpGet("undo/{id}")]
        public async Task<IActionResult> UndoDeleteWorker(int id) {

            var worker = await _service.GetDeletedWorkerById(id);

            
            if (worker == null){
                return NotFound();
            }
            var updated = await _service.UndoDeleteWorker(worker);
            
            if (updated) {
                return Ok(worker);
            } else {
                return NotFound();
            }
        } 

        private bool WorkerExists(int id)
        {
            return _context.Workers.Any(e => e.Id == id);
        }
    }
}
