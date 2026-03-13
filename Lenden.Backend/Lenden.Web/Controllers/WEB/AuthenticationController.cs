using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Lenden.Application.DTOs;
using Lenden.Web.Models;
using Microsoft.AspNetCore.Mvc;

public class AuthenticationController : Controller
{
    private readonly IHttpClientFactory _httpClientFactory;
    
    public AuthenticationController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        var client = _httpClientFactory.CreateClient();
        var content = new StringContent(
            JsonSerializer.Serialize(model), Encoding.UTF8, "application/json");

        var response = await client.PostAsync("/api/v1/AuthenticationApi/login", content);

        if (!response.IsSuccessStatusCode)
        {
            ModelState.AddModelError("", "Invalid email or password");
            return View(model);
        }

        var data = await JsonSerializer.DeserializeAsync<AuthResponseDto>(
            await response.Content.ReadAsStreamAsync());

        // store tokens in session
        HttpContext.Session.SetString("token", data.AccessToken);
        HttpContext.Session.SetString("refreshToken", data.RefreshToken);

        return RedirectToAction("Index", "Home");
    }
}