using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace Aprendizaje
{
  public class Startup
  {
    public static void ConfigureServices(IServiceCollection services)
    {
      services.AddControllersWithViews().AddRazorRuntimeCompilation();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Mi API", Version = "v1" });
      });
    }
    public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if(env.IsDevelopment()) app.UseDeveloperExceptionPage();
      
      app.UseSwagger();
      app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Mi API V1"); });
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