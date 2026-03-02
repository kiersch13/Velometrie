using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace App.Filters
{
    /// <summary>
    /// Clears ModelState before the ApiController's ModelStateInvalidFilter (Order -2000) runs,
    /// effectively disabling automatic 400 responses for endpoints that intentionally accept
    /// partial / incomplete payloads (e.g. the enrich endpoint).
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public sealed class SkipModelValidationAttribute : Attribute, IActionFilter, IOrderedFilter
    {
        // Must be lower than ModelStateInvalidFilter.Order (-2000) so this runs first.
        public int Order => int.MinValue;

        public void OnActionExecuting(ActionExecutingContext context) =>
            context.ModelState.Clear();

        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}
