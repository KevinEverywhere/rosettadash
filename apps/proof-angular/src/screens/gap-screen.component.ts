import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { DestinationAtlasScreenId } from '@rosettadash/core';

@Component({
  selector: 'da-gap-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="da-panel">
      <h2>{{ label() }}</h2>
      <p>
        This screen is not yet ported to the Angular proof app (<code>apps/proof-angular</code>).
        Use the React proof app as the reference implementation while DAS-123 work continues.
      </p>
      <div class="da-gap-note">
        <p><strong>Screen id:</strong> <code>{{ screenId() }}</code></p>
        <p>
          Some RosettaDash Angular bindings are still stubs or missing compared to React (charts with live
          data, GeoExplorerLayout, FilterGrid, and others). Those will land in follow-up runtime tasks.
        </p>
      </div>
    </section>
  `,
})
export class GapScreenComponent {
  readonly screenId = input.required<DestinationAtlasScreenId>();
  readonly label = input.required<string>();
}
