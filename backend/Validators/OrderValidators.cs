using FluentValidation;
using FurnitureShop.Api.DTOs.Orders;

namespace FurnitureShop.Api.Validators;

public class AddressDtoValidator : AbstractValidator<AddressDto>
{
    public AddressDtoValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Phone).NotEmpty().MinimumLength(7).MaximumLength(20);
        RuleFor(x => x.Line1).NotEmpty().MaximumLength(200);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.State).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PostalCode).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
    }
}

public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.ShippingAddress).NotNull().SetValidator(new AddressDtoValidator());
        RuleFor(x => x.BillingAddress).SetValidator(new AddressDtoValidator()!).When(x => x.BillingAddress != null);
        RuleFor(x => x.Notes).MaximumLength(1000);
    }
}
