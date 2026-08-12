# Glossary

| Term | Definition |
|------|------------|
| **Builder runtime** | The RosettaDash application used to design components (Angular client + NestJS server). |
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
| **Standalone export** | Default export mode: all source inlined in the zip; no `@rosettadash/*` runtime packages required. See [Standalone-first export](./32-standalone-first-export.md). |
| **Runtime package** | Optional npm package (e.g. `@rosettadash/web-components`) mirroring palette components; opt-in via `exportMode: 'package'`. Built after standalone is complete. |
| **`rosettadash` (product)** | The builder monorepo / product — same as `git clone`. Not a component install barrel. See [npm package prep](./33-npm-package-prep.md). |
| **`@rosettadash/<runtime>/<group>/…/<component>`** | Component import path. **One or more** group segments; same subpaths on every runtime package (`web-components`, `react`, `angular`, `vue`, `svelte`, …). |
| **Atom (npm)** | Single taxonomy component, e.g. `@rosettadash/react/layout/accordion` ↔ `layout.accordion`. |
| **Recipe (npm)** | Documented composition of atoms, optional helper (e.g. `@rosettadash/react/layout/accordion-link-list`). Not a `composite.*` registry type. |
| **`--rd-*` tokens** | Public CSS variables for the npm stylesheet contract. Opt-in via runtime `tokens.css` / `styles.css`. |
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
