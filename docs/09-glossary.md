# Glossary

| Term | Definition |
|------|------------|
| **Builder runtime** | The DashBuilder application used to design components (Angular client + NestJS server). |
| **Exported runtime** | The user's application that receives generated code. |
| **Component** | A typed node in the composite graph with properties and ports. |
| **Visual component** | A component rendered in the end-user browser UI. |
| **Infrastructure component** | A non-visual node (database, server, env config) that generates backend/config artifacts. |
| **Composite** | A named graph of components and bindings representing a dashboard page or module. |
| **Binding** | A connection between an output port on one node and an input port on another. |
| **Port** | Typed input or output connection point on a component. |
| **Palette** | Sidebar catalog of available component types. |
| **Canvas** | Drag-and-drop design surface where composites are assembled. |
| **Inspector** | Property editor panel for the selected component. |
| **IR (Intermediate Representation)** | Framework-agnostic structure produced from a composite and consumed by exporters. |
| **Exporter** | Plugin that generates source files for a specific UI framework, server, or database. |
| **Export target** | User-selected combination of UI framework, server partner, and optional database. |
| **Smart defaults** | Automated suggestions for properties, bindings, and companion components. |
| **Domain context** | Client, project, role, and time scoping metadata attached to a composite. |
| **Piecemeal export** | Exporting a single component with minimal dependencies. |
| **Grouped export** | Exporting a selection or full composite with wiring and infrastructure. |
| **Preview** | Builder-side approximation of component behavior before export. |
| **Env var spec** | Definition of an environment variable name, description, and required flag—never the secret value. |
| **Role gate** | Component that conditionally shows children based on user role. |
| **Time context** | Active date range and granularity driving data queries and charts. |
| **Onboarding flow** | Composite template for inviting persons and assigning roles. |
| **Feature branch** | Git branch named `feature/DAS-<n>-<description>`; sole branch type for development work. |

## Related documents

- [Vision & Product Overview](./01-vision-and-product-overview.md)
- [Component Model](./03-component-model.md)
