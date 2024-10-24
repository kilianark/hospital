namespace hospitalDTO.DTOapi {
    public class RoomDTO {
        public required int Id {get; set;}
        public required int RoomNumber {get; set;}
        public required int Capacity {get; set;}
        public required string Zone { get; set; } //ambulatorio, hospitalizado.......
        public string Area { get; set; } //psiquiatría, oncología............
        public required int Floor { get; set; } 
        public required bool Availability { get; set; }
        public ICollection<BedDTO> Beds { get; } = new List<BedDTO>();
    }
}