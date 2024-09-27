using ApiHospital.Models;
using AutoMapper;
using hospitalDTO.DTOapi;

namespace ApiHospital.Data
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Bed, BedDTO>().ReverseMap();
            CreateMap<Patient, PatientDTO>().ReverseMap();
            CreateMap<Room, RoomDTO>().ReverseMap();
            CreateMap<Doctor, DoctorDTO>().ReverseMap();
        }
    }
}
