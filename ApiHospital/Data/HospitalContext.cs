using ApiHospital.Models;
using Microsoft.EntityFrameworkCore;

// millor situar el context en la carpeta Data
// Models sol contenir definicions de les ENTITATs de dades
// si es decideix en la carpeta Models, simplement el NS, serà el model.Models
// i s'actualitza l'startup.cs en el using...Models
// Data es una carpeta nova que es troba en l'arrel del projecte API

// fitxer del context
namespace ApiHospital.Data
{
    public class HospitalContext : DbContext
    {
        public HospitalContext(DbContextOptions<HospitalContext> options)
            : base(options)
        {
            // no sol contenir res en el cos
        }

        // implementem la BBDD pels llits, amb els seus accessors
        public DbSet<Bed> Beds { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Patient> Patients { get; set; } = null!;
        public DbSet<Person> Persons { get; set; } = null!;
        public DbSet<Worker> Workers { get; set; } = null!;   
        public DbSet<Doctor> Doctors { get; set; } = null!;
        public DbSet<Nurse> Nurses { get; set; } = null!;
        public DbSet<Administrator> Administrators { get; set; } = null!;   
        public DbSet<Consultation> Consultations { get; set; } = null!; 
        public DbSet<Move> Moves { get; set; } = null!;   
        public DbSet<Hospital> Hospitals { get; set; } = null!;
        public DbSet<Appointment> Appointments { get; set; } = null!;

        


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>()
                .ToTable("Persons")
                .HasQueryFilter(x => x.IsDeleted == false);

            modelBuilder.Entity<Patient>()
                .ToTable("Patients");

             modelBuilder.Entity<Worker>()
                .ToTable("Workers");
            
            modelBuilder.Entity<Doctor>()
                .ToTable("Doctors");

            modelBuilder.Entity<Administrator>()
                .ToTable("Administrators");
            
            modelBuilder.Entity<Nurse>()
                .ToTable("Nurses");
            
            modelBuilder.Entity<Patient>()
                .HasBaseType<Person>();
            
            modelBuilder.Entity<Worker>()
                .HasBaseType<Person>();
            
            modelBuilder.Entity<Doctor>()
                .HasBaseType<Worker>();
            
            modelBuilder.Entity<Nurse>()
                .HasBaseType<Worker>();

            modelBuilder.Entity<Administrator>()
                .HasBaseType<Worker>();

            modelBuilder.Entity<Appointment>()
                .HasBaseType<Appointment>();
            modelBuilder
                .Entity<Bed>()
                .HasQueryFilter(x => x.IsDeleted == false)
                .HasOne<Patient>()
                .WithOne()
                .HasForeignKey<Patient>(p => p.BedId);

            modelBuilder
                .Entity<Room>()
                .HasQueryFilter(x => x.IsDeleted == false)
                .HasMany(e => e.Beds)
                .WithOne()
                .HasForeignKey(e => e.RoomId)
                .IsRequired();
            
            modelBuilder.Entity<Move>()
                .HasQueryFilter(x => x.IsDeleted == false);
            
            modelBuilder.Entity<Consultation>()
                .HasQueryFilter(x => x.IsDeleted == false);
            
            modelBuilder.Entity<Hospital>()
                .HasQueryFilter(x => x.IsDeleted == false);
        }
    }
}
