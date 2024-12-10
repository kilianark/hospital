using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Security.Claims;

namespace ApiHospital.Interceptors {

        public class HospitalQueryMiddleware {
        private readonly RequestDelegate _next;

        public HospitalQueryMiddleware(RequestDelegate next) {

            _next = next;
            
        }

        public async Task InvokeAsync(HttpContext context) {
            
            var user = context.User;
            Console.WriteLine(user.Identity.IsAuthenticated);
            if (user.Identity.IsAuthenticated) {

                var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
                foreach (string role in roles) {
                    Console.WriteLine(role);
                }

                if (roles.Contains("Goldenfold")) {
                    context.Request.QueryString = new QueryString("?" + context.Request.QueryString.ToString() + "&Hospital=1");
                }
                if (roles.Contains("HospitalFaro")) {
                    context.Request.QueryString = new QueryString("?" + context.Request.QueryString.ToString() + "&Hospital=2");
                }
            }

            await _next(context);
            
        }
    }
}