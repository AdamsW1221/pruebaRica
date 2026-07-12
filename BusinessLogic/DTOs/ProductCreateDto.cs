using System.ComponentModel.DataAnnotations;

namespace BusinessLogic.DTOs
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre del producto no puede exceder los 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "La cantidad inicial es obligatoria.")]
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor o igual a 0.")]
        public int Quantity { get; set; }

        public string? ImageUrl { get; set; }
    }
}
