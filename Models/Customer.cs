namespace Aprendizaje.Models
{
  public class Customer
  {
    public string? CustomerId { get; set; }
    public string Name { get; set; } = default!;
    public string Country { get; set; } = default!;
  }
}