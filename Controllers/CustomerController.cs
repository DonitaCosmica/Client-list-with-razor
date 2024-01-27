using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Aprendizaje.Models;

namespace Aprendizaje.Controllers
{
  public class CustomerController : Controller
  {
    private const string ConnectionString = "Data Source=RAYOSISTEMAS1;Initial Catalog=company;Integrated Security=True;";

    [HttpGet]
    [Route("api/customerapi/getcustomers")]
    public IActionResult GetCustomers()
    {
      string sqlQuery = "SELECT CustomerId, Name, Country FROM Customers";
      List<Customer> customers = ExecuteGetQuery(sqlQuery);

      return View("/Views/Index.cshtml", customers);
    }

    [HttpGet]
    [Route("api/customerapi/getcustomers/{country}")]
    public IActionResult GetCustomersByCountry(string country)
    {
      string sqlQuery = "SELECT CustomerId, Name, Country FROM Customers WHERE Country = @Country;";
      List<Customer> customers = ExecuteGetQuery(sqlQuery, new SqlParameter("@Country", country));

      return View("/Views/Index.cshtml", customers);
    }

    [HttpPost]
    [Route("api/customerapi/addcustomer")]
    public IActionResult CreateCustomer([FromBody] Customer newCustomer)
    {
      string sqlQuery = "INSERT INTO Customers (CustomerId, Name, Country) VALUES (@CustomerId, @Name, @Country);";
      
      try
      {
        using SqlConnection sqlConnection = new(ConnectionString);
        sqlConnection.Open();

        using SqlCommand sqlCommand = new(sqlQuery, sqlConnection);
        sqlCommand.Parameters.AddWithValue("@CustomerId", newCustomer.CustomerId);
        sqlCommand.Parameters.AddWithValue("@Name", newCustomer.Name);
        sqlCommand.Parameters.AddWithValue("@Country", newCustomer.Country);
        sqlCommand.ExecuteNonQuery();
        
        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
        return BadRequest(new { message = $"Error: {ex.Message}" });
      }

      return Ok(new { message = "Customer has been created correctly!" });
    }

    [HttpPatch]
    [Route("api/customerapi/updatecustomer")]
    public IActionResult UpdateCustomer([FromBody] Customer customer)
    {
      string sqlQuery = "UPDATE Customers SET Name = @Name, Country = @Country WHERE CustomerId = @CustomerId";

      try
      {
        using SqlConnection sqlConnection = new(ConnectionString);
        sqlConnection.Open();

        using SqlCommand sqlCommand = new(sqlQuery, sqlConnection);
        sqlCommand.Parameters.AddWithValue("@CustomerId", customer.CustomerId);
        sqlCommand.Parameters.AddWithValue("@Name", customer.Name);
        sqlCommand.Parameters.AddWithValue("@Country", customer.Country);
        sqlCommand.ExecuteNonQuery();

        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
        return BadRequest(new { message = $"Error: {ex.Message}" });
      }

      return Ok(new { message = "Customer has been updated correctly!" });
    }

    [HttpDelete]
    [Route("api/customerapi/deletecustomer/{customerId}")]
    public IActionResult DeleteCustomer(int customerId)
    {
      string sqlQuery = "DELETE FROM Customers WHERE CustomerId = @CustomerId;";

      try
      {
        using SqlConnection sqlConnection = new(ConnectionString);
        sqlConnection.Open();

        using SqlCommand sqlCommand = new(sqlQuery, sqlConnection);
        sqlCommand.Parameters.AddWithValue("@CustomerId", customerId);
        sqlCommand.ExecuteNonQuery();

        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
        return BadRequest(new { message = $"Error: {ex.Message}" });
      }

      return Ok(new { message = "Customer has been eliminated correctly!" });
    }

    private static List<Customer> ExecuteGetQuery(string sqlQuery, params SqlParameter[] parameters)
    {
      List<Customer> customers = [];

      try
      {
        using SqlConnection sqlConnection = new(ConnectionString);
        sqlConnection.Open();

        using SqlCommand sqlCommand = new(sqlQuery, sqlConnection);
        sqlCommand.Parameters.AddRange(parameters);

        using SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
        while(sqlDataReader.Read())
        {
          customers.Add(new Customer
          {
            CustomerId = Convert.ToInt32(sqlDataReader["CustomerId"]),
            Name = sqlDataReader["Name"].ToString() ?? "Null",
            Country = sqlDataReader["Country"].ToString() ?? "Null"
          });
        }
        sqlConnection.Close();
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
      }

      return customers;
    }
  }
}