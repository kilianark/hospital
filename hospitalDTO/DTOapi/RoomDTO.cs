namespace hospitalDTO.DTOapi {
    public class RoomDTO {
        public int Id {get; set;}
        public int Capacity {get; set;}
        public int RoomNumber {get; set;}
        public string? RoomType { get; set; }
        public bool Disponibility { get; set; }
        public ICollection<BedDTO> Beds { get; } = new List<BedDTO>();
    }
}