using Microsoft.AspNetCore.Mvc.Filters;

namespace ApiHospital.Interceptors {
    public class HospitalQueryInterceptor : ActionFilterAttribute {

        private readonly HttpContext _httpContext;

        public HospitalQueryInterceptor (HttpContext context) {
            _httpContext = context;
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (_httpContext.User.IsInRole("manage_room")) {
                Console.Write("ROLES FILTROS");
            }

            base.OnActionExecuting(context);
        }
    }
}