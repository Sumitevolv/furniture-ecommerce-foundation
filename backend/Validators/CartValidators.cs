using FluentValidation;
using FurnitureShop.Api.DTOs.Cart;

namespace FurnitureShop.Api.Validators;

public class AddCartItemRequestValidator : AbstractValidator<AddCartItemRequest>
{
    public AddCartItemRequestValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Quantity).InclusiveBetween(1, 10);
    }
}

public class UpdateCartItemRequestValidator : AbstractValidator<UpdateCartItemRequest>
{
    public UpdateCartItemRequestValidator()
    {
        RuleFor(x => x.Quantity).InclusiveBetween(1, 10);
    }
}
