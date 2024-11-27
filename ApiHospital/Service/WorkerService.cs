using ApiHospital.Data;
using ApiHospital.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiHospital.Service {
    public class WorkerService {
        private readonly HospitalContext _context;

        private readonly IMapper _mapper;

        public WorkerService(HospitalContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> UndoDeleteWorker(Worker worker) {
            worker.Undo();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkerExists(worker.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<Worker> GetDeletedWorkerById(int id) {
            return await _context.Workers.IgnoreQueryFilters().FirstOrDefaultAsync(w => w.Id == id);
        }


        private bool WorkerExists(int id)
        {
            return _context.Workers.Any(e => e.Id == id);
        }

    }
}