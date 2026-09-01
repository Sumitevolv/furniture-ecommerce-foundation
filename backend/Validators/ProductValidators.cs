using FluentValidation;
using FurnitureShop.Api.DTOs.Products;

namespace FurnitureShop.Api.Validators;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.CompareAtPrice).GreaterThan(0).When(x => x.CompareAtPrice.HasValue);
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
    }
}

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.CompareAtPrice).GreaterThan(0).When(x => x.CompareAtPrice.HasValue);
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
    }
}

public class CreateReviewRequestValidator : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).NotEmpty().MinimumLength(10).MaximumLength(2000);
        RuleFor(x => x.Title).MaximumLength(150);
    }
}
