using System.ComponentModel.DataAnnotations;

namespace BusinessLogic.DTOs
{
    public class UpdateRoleRequest
    {
        [Required(ErrorMessage = "El rol es obligatorio.")]
        [RegularExpression("^(SuperAdmin|Admin|User)$", ErrorMessage = "El rol debe ser SuperAdmin, Admin o User.")]
        public string Role { get; set; } = string.Empty;
    }
}
