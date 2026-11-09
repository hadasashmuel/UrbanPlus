using DAL.Entities;
using DTO.UserDTO;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BLL.Services.ServiceSupport.TokenServices
{
    public class TokenService : ITokenService
    {

        private readonly IConfiguration _config;

        public TokenService(IConfiguration config) => _config = config;

        public AuthResponseUserDto CreateToken(Users user)
        {
            // המפתח הסודי מגיע ממשתנה הסביבה Jwt__Key, לא מהקוד
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // ה-claims: מה שהשרת "יודע" על המשתמש בכל בקשה
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.RoleCode.ToString())
        };

            var minutes = int.Parse(_config["Jwt:ExpiresMinutes"] ?? "60");
            var expires = DateTime.UtcNow.AddMinutes(minutes);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: credentials);

            return new AuthResponseUserDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expires
            };
        }
    }
}
