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
using Microsoft.Identity.Client;

namespace ApiHospital.Service {

    public class RoomService {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public RoomService(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //CRUD Operations

        public IQueryable<Room> GetRooms(
        int? RoomNumber = null,
        int? Capacity = null,
        string? Zone = null,
        string? Area = null,
        int? Floor = null,
        bool? Availability = null,
        int? BedId = null,
        int?[] Hospital = null) {


            IQueryable<Room> query = GetQuery();

            query = ApplyFilter(query, RoomNumber, r => r.RoomNumber == RoomNumber!.Value);
            query = ApplyFilter(query, Capacity, r => r.Capacity == Capacity);
            query = ApplyFilter(query, Zone, r => !string.IsNullOrWhiteSpace(Zone) && r.Zone.ToLower().StartsWith(Zone.ToLower()));
            query = ApplyFilter(query, Area, r => !string.IsNullOrWhiteSpace(Area) && r.Area.ToLower().StartsWith(Area.ToLower())); // Cambié Surname1 a Area
            query = ApplyFilter(query, Floor, r => r.Floor == Floor);
            query = ApplyFilter(query, Availability, r => r.Availability == Availability);
            query = ApplyFilter(query, BedId, r => r.Beds.Any(b => b.Id == BedId));
            query = ApplyFilter(query, Hospital, r => Hospital.Contains(r.Hospital));
            return query;

        }

        public async Task<Room> GetRoomById(int roomId) {
            return await _context
                .Rooms.Include(r => r.Beds)
                .FirstOrDefaultAsync(r => r.Id == roomId); 
        }

        public async Task<bool> UpdateRoom(RoomDTO roomDTO, Room room) {

            _mapper.Map(roomDTO, room);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(room.Id))
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

        public async Task<Room> CreateRoom(RoomDTO roomDTO) {
            var room = _mapper.Map<Room>(roomDTO);
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<bool> DeleteRoom(Room room) {
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return true;
        }

        //Auxiliary Methods

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }

        public async Task<bool> RoomHasBeds (Room room) {
            return await _context.Beds.AnyAsync(b => b.RoomId == room.Id);
        }

        public async Task<bool> RoomNumberExists(int roomNumber) {
            return await _context.Rooms.AnyAsync(r => r.RoomNumber == roomNumber);
        }

        private IQueryable<Room> ApplyFilter(
            IQueryable<Room> query,
            object? filterValue,
            Expression<Func<Room, bool>> filterExpression
        )
        {
            if (filterValue != null)
            {
                query = query.Where(filterExpression);
            }

            return query;
        }

        public IQueryable<Room> GetQuery() {
            return _context.Rooms;
        }
    }
}