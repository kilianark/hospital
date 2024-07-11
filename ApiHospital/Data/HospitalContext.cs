using Microsoft.EntityFrameworkCore;
using ApiHospital.Models;

// millor situar el context en la carpeta Data
// Models sol contenir definicions de les ENTITATs de dades
// si es decideix en la carpeta Models, simplement el NS, serà el model.Models
// i s'actualitza l'startup.cs en el using...Models;
// Data es una carpeta nova que es troba en l'arrel del projecte API

// fitxer del context
namespace ApiHospital.Data
{
    public class HospitalContext : DbContext
    {
        public HospitalContext(DbContextOptions<HospitalContext> options) : base(options)
        {
            // no sol contenir res en el cos
        }

        // implementem la BBDD pels llits, amb els seus accessors 
        public DbSet<Bed> Beds { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Patient> Patients { get; set; } = null!;
    }
}