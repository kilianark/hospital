using Microsoft.EntityFrameworkCore;
using ApiHospital.Data;
using hospitalDTO.DTOapi;
using ApiHospital.Models;
// Descomentar el següent using NOMES si implementem el context NO amb "Mysql", sinó OracleDatabase
// Caldrà canviar al Oracle DataBase
// using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(opt => opt.AddDefaultPolicy(policy => 
    policy.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()));
builder.Services.AddControllers();
builder.Services.AddDbContext<HospitalContext>(opt => opt.UseInMemoryDatabase("Hospital"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(cfg => {
    cfg.CreateMap<Bed, BedDTO>().ReverseMap();
    cfg.CreateMap<Patient, PatientDTO>().ReverseMap();
    cfg.CreateMap<Room, RoomDTO>().ReverseMap();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
