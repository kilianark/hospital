using Microsoft.EntityFrameworkCore;
using ApiHospital.Data;
using hospitalDTO.DTOapi;
using ApiHospital.Models;
using ApiHospital.Shared;
// Descomentar el següent using NOMES si implementem el context NO amb "Mysql", sinó OracleDatabase
// Caldrà canviar al Oracle DataBase
// using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(opt => opt.AddDefaultPolicy(policy => 
    policy.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()));
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
});
builder.Services.AddDbContext<HospitalContext>(opt => opt.UseOracle("User Id=SYSTEM;Password=Th3Bl4ckB0ol5!;Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=oscarrovira.com)(PORT=11521))))"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
/*
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "HospitalController": "User Id=system;Password=Th3Bl4ckB0ol5!;Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=oscarrovira.com)(PORT=11521))))"
  }*/
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(cfg => cfg.AddProfile(new MapperProfile()));

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
