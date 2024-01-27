namespace Aprendizaje.Models
{
  public class Customer
  {
    public int CustomerId { get; set; }
    public string Name { get; set; } = default!;
    public string? Country { get; set; }
  }
}