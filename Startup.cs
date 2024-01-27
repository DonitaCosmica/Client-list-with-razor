using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Aprendizaje
{
  public class Startup
  {
    public static void ConfigureServices(IServiceCollection services)
    {
      services.AddControllersWithViews().AddRazorRuntimeCompilation();
    }
    public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if(env.IsDevelopment()) app.UseDeveloperExceptionPage();

      app.UseRouting();
      app.UseStaticFiles();
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapGet("/", async context =>
        {
          await context.Response.WriteAsync("Hola desde ASP.NET Core");
        });
        
        endpoints.MapControllerRoute(
          name: "default",
          pattern: "{controller=Home}/{action=Index}/{id?}"
        );
      });
    }
  }
}