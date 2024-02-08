using Aprendizaje.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Aprendizaje.Models;

namespace Aprendizaje.Controllers
{
  public class CustomerController : Controller
  {
    private const string ConnectionString = "Data Source=RAYOSISTEMAS1;Initial Catalog=Company;Integrated Security=True;";

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

      if(!ExecuteModifyQuery(sqlQuery, [
        new SqlParameter("@CustomerId", Guid.NewGuid().ToString()),
        new SqlParameter("@Name", newCustomer.Name),
        new SqlParameter("@Country", newCustomer.Country)
      ])) return BadRequest();

      return Ok(new { message = "Customer has been created correctly!" });
    }

    [HttpPatch]
    [Route("api/customerapi/updatecustomer/{customerId}")]
    public IActionResult UpdateCustomer(string customerId, [FromBody] Customer customer)
    {
      string sqlQuery = "UPDATE Customers SET Name = @Name, Country = @Country WHERE CustomerId = @CustomerId";

      if(!ExecuteModifyQuery(sqlQuery, [
        new SqlParameter("@CustomerId", customerId),
        new SqlParameter("@Name", customer.Name),
        new SqlParameter("@Country", customer.Country)
      ])) return BadRequest();

      return Ok(new { message = "Customer has been updated correctly!" });
    }

    [HttpDelete]
    [Route("api/customerapi/deletecustomer/{customerId}")]
    public IActionResult DeleteCustomer(string customerId)
    {
      string sqlQuery = "DELETE FROM Customers WHERE CustomerId = @CustomerId;";
      if(!ExecuteModifyQuery(sqlQuery, new SqlParameter("@CustomerId", customerId))) return BadRequest();
      
      return Ok(new { message = "Customer has been eliminated correctly!" });
    }

    private static List<Customer> ExecuteGetQuery(string sqlQuery, params SqlParameter[] parameters)
    {
      List<Customer> customers = [];

      try
      {
        using SqlConnection sqlConnection = ConnectionDB.GetConnection();
        using SqlCommand sqlCommand = new(sqlQuery, sqlConnection);
        sqlCommand.Parameters.AddRange(parameters);

        using SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
        while(sqlDataReader.Read())
        {
          customers.Add(new Customer
          {
            CustomerId = sqlDataReader["CustomerId"].ToString() ?? "Null",
            Name = sqlDataReader["Name"].ToString() ?? "Null",
            Country = sqlDataReader["Country"].ToString() ?? "Null"
          });
        }
        ConnectionDB.CloseConnection();
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
      }

      return customers;
    }

    private static bool ExecuteModifyQuery(string sqlQuery, params SqlParameter[] parameters)
    {
      try
      {
        using SqlConnection sqlConnection = ConnectionDB.GetConnection();
        using SqlCommand sqlCommand = new(sqlQuery, sqlConnection);
        sqlCommand.Parameters.AddRange(parameters);

        int rowsAffected = sqlCommand.ExecuteNonQuery();
        ConnectionDB.CloseConnection();

        return rowsAffected > 0;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error: {ex.Message}");
        return false;
      }
    }
  }
}