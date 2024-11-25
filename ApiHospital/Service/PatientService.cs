using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ApiHospital.Data;
using ApiHospital.Models;
using ApiHospital.Service;
using AutoMapper;
using hospitalDTO.DTOapi;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Identity.Client;

namespace ApiHospital.Service {

    public class PatientService {

        private readonly HospitalContext _context;

        private readonly IMapper _mapper;

        public PatientService(HospitalContext context, IMapper mapper) {

            _context = context;
            _mapper = mapper;

        }

        //CRUD Operations

        public IQueryable<Patient> GetPatients(
            int? PatientCode,
            string? Name,
            string? Surname1,
            string? Surname2,
            string? Dni,
            string? Cip,
            string? Phone,
            string? Zone,
            string? Area,
            int? BedId,
            bool? Ingresados,
            int? Hospital
        ) {

            IQueryable<Patient> query = GetQuery();

            query = ApplyFilter(query, PatientCode, p => p.PatientCode == PatientCode!.Value);
            query = ApplyFilter(query, Name, p => !string.IsNullOrWhiteSpace(Name) && p.Name.ToLower().StartsWith(Name.ToLower()));
            query = ApplyFilter(query, Surname1, p => !string.IsNullOrWhiteSpace(Surname1) && p.Surname1.ToLower().StartsWith(Surname1.ToLower()));
            query = ApplyFilter(query, Surname2, p => !string.IsNullOrWhiteSpace(Surname2) && p.Surname2.ToLower().StartsWith(Surname2.ToLower()));
            query = ApplyFilter(query, Dni, p => !string.IsNullOrWhiteSpace(Dni) && p.Dni.ToLower().StartsWith(Dni.ToLower()));
            query = ApplyFilter(query, Cip, p => !string.IsNullOrWhiteSpace(Cip) && p.CIP.ToLower().StartsWith(Cip.ToLower()));
            query = ApplyFilter(query, Phone, p => !string.IsNullOrWhiteSpace(Phone) && p.Phone.ToLower().StartsWith(Phone.ToLower()));
            query = ApplyFilter(query, Zone, p => !string.IsNullOrWhiteSpace(Zone) && p.Zone.ToLower().StartsWith(Zone.ToLower()));
            query = ApplyFilter(query, Area, p => !string.IsNullOrWhiteSpace(Area) && p.Area.ToLower().StartsWith(Area.ToLower()));
            query = ApplyFilter(query, BedId, p => p.BedId == BedId!.Value);
            query = ApplyFilter(query, Ingresados, p => Ingresados == true && p.BedId != null);
            query = ApplyFilter(query, Hospital, p => p.Hospital == Hospital!.Value);

            return query;

        }

        public async Task<Patient> GetPatientById(int id) {
            return await _context
                .Patients.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<bool> UpdatePatient(PatientDTO patientDTO, Patient patient) {

            _mapper.Map(patientDTO, patient);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(patient.Id))
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

        public async Task<Patient> CreatePatient(PatientDTO patientDTO) {
            var patient = _mapper.Map<Patient>(patientDTO);
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<bool> DeletePatient(Patient patient) {
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return true;
        }

        //Auxiliary Methods

        public IQueryable<Patient> GetQuery() {
            return _context.Patients;
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

        public bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }

        public bool BedExists(int? id)
        {
            if (id == null)
                return false;
            return _context.Beds.Any(e => e.Id == id);
        }

    }
}