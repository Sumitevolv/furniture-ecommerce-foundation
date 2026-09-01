using FluentValidation;
using FurnitureShop.Api.DTOs.Ai;

namespace FurnitureShop.Api.Validators;

public class AiChatRequestValidator : AbstractValidator<AiChatRequest>
{
    public AiChatRequestValidator()
    {
        RuleFor(x => x.Message).NotEmpty().MaximumLength(1000);
    }
}
