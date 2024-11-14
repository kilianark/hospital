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

    public class RoomService : ControllerBase {
        private readonly HospitalContext _context;

        public RoomService(HospitalContext context)
        {
            _context = context;
        }

        public IQueryable<Room> getRoomsQuery() {
            return _context.Rooms;
        }

        //public async Task<Room> GetRoomById(int roomId) {

        //}

        public async Task<IActionResult> DeleteRoom(int roomId) {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
            {
                return NotFound();
            }
            var hasBed = await _context.Beds.AnyAsync(b => b.RoomId == room.Id);

            if (hasBed) return BadRequest("Cannot eliminate a room with beds");

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}