import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { createBreadcrumbSchema, SchemaMarkup } from "./SchemaMarkup";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const baseUrl = window.location.origin;
  
  // Add home as first item
  const allItems = [
    { label: "Home", href: "/" },
    ...items,
  ];

  // Generate schema
  const breadcrumbSchema = createBreadcrumbSchema(
    allItems.map((item) => ({
      name: item.label,
      url: `${baseUrl}${item.href}`,
    }))
  );

  return (
    <>
      <SchemaMarkup type={breadcrumbSchema.type} data={breadcrumbSchema.data} />
      
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0;

          return (
            <div key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
              )}
              
              {isLast ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-foreground transition-colors flex items-center"
                >
                  {isFirst && <Home className="h-4 w-4 mr-1" />}
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
