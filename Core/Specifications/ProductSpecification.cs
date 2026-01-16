using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
	public class ProductSpecification : BaseSpecification<Product>
	{
		public ProductSpecification(ProductSpecParams specParams)
    : base(x =>
        (string.IsNullOrEmpty(specParams.Search) ||
         x.Name.ToLower().Contains(specParams.Search.ToLower())) &&

        (
            (!specParams.Brands.Any() &&
             !specParams.Types.Any()) ||

            specParams.Brands.Any(b => b.ToLower() == x.Brand.ToLower()) ||
            specParams.Types.Any(t => t.ToLower() == x.Type.ToLower())
        )
    )
{
    // Default sorting
    AddOrderBy(p => p.Name);

    // Pagination
    ApplyPaging(
        specParams.PageSize * (specParams.PageIndex - 1),
        specParams.PageSize
    );

    // Sorting
    switch (specParams.Sort)
    {
        case "priceAsc":
            AddOrderBy(x => x.Price);
            break;

        case "priceDesc":
            AddOrderByDescending(x => x.Price);
            break;

        default:
            AddOrderBy(x => x.Name);
            break;
    }
}
	}
}