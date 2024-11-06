using ApiHospital.Models;
using AutoMapper;
using hospitalDTO.DTOapi;

namespace ApiHospital.Data
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Administrator, AdministratorDTO>().ReverseMap();
            CreateMap<Bed, BedDTO>().ReverseMap();
            CreateMap<Consultation, ConsultationDTO>().ReverseMap();
            CreateMap<Doctor, DoctorDTO>().ReverseMap();
            CreateMap<Hospital, HospitalDTO>().ReverseMap();
            CreateMap<Move, MoveDTO>().ReverseMap();
            CreateMap<Nurse, NurseDTO>().ReverseMap();
            CreateMap<Patient, PatientDTO>().ReverseMap();
            CreateMap<Room, RoomDTO>().ReverseMap();
            CreateMap<Hospital, HospitalDTO>().ReverseMap();
        }
    }
}
