using System.Data.SqlClient;

namespace Aprendizaje.Utils
{
  public class ConnectionDB
  {
    private const string ConnectionString = "Data Source=RAYOSISTEMAS1;Initial Catalog=Company;Integrated Security=True;";
    private static readonly object lockObject = new();
    private static SqlConnection? sqlConnection;

    private ConnectionDB() {}
    public static SqlConnection GetConnection()
    {
      lock(lockObject)
      {
        if(sqlConnection == null)
        {
          sqlConnection = new SqlConnection(ConnectionString);
          sqlConnection.Open();
        }
        else if(sqlConnection.State == System.Data.ConnectionState.Closed)
        {
          sqlConnection.Open();
        }

        return sqlConnection;
      }
    }
    public static void CloseConnection()
    {
      lock(lockObject)
      {
        if(sqlConnection != null && sqlConnection.State == System.Data.ConnectionState.Open)
          sqlConnection.Close();
      }
    }
  }
}