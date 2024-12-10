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

                var queryString = context.Request.QueryString.ToString();
                var updatedQueryString = queryString;

                if (roles.Contains("Goldenfold")) {
                    updatedQueryString += "&Hospital=1";
                }
                if (roles.Contains("HospitalFaro")) {
                    updatedQueryString += "&Hospital=2";
                }
                if (updatedQueryString != queryString) {
                    Console.WriteLine(updatedQueryString);
                    context.Request.QueryString = new QueryString("?" + updatedQueryString);
                }   
            }

            

            await _next(context);
            
        }
    }
}