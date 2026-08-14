import { PersonInvite } from '@rosettadash/react/domain/person-invite';
import { RoleAssign } from '@rosettadash/react/domain/role-assign';
import { RoleGate } from '@rosettadash/react/domain/role-gate';
import { Timer } from '@rosettadash/react/logic/timer';
import { TextInput } from '@rosettadash/react/visual/input/text';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import { NumberInput } from '@rosettadash/react/visual/input/number';
import { TextareaInput } from '@rosettadash/react/visual/input/textarea';
import { CheckboxInput } from '@rosettadash/react/visual/input/checkbox';

export function PlanScreen() {
  return (
    <section className="da-panel">
      <h2>Plan trip</h2>
      <p>Trip planning, collaboration, and role-gated editor access.</p>
      <div className="da-stack">
        <RoleGate label="Trip editor" allowedRoles={['editor', 'admin']} statusText="Visible to editors" />
        <PersonInvite emailPlaceholder="planner@company.com" />
        <RoleAssign
          summary="Confirm collaborator access for this itinerary."
          roleOptions={[
            { value: 'viewer', label: 'Viewer' },
            { value: 'editor', label: 'Editor' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
        <Timer label="Itinerary refresh" mode="interval" intervalMs={5000} tickCount={3} />
        <div className="da-stack da-stack--2">
          <TextInput label="Trip name" placeholder="Spring heritage tour" />
          <SelectInput
            label="Primary destination"
            placeholder="Select destination…"
            options={[
              { value: 'tokyo', label: 'Tokyo' },
              { value: 'paris', label: 'Paris' },
              { value: 'cusco', label: 'Cusco' },
            ]}
          />
        </div>
        <div className="da-stack da-stack--2">
          <NumberInput label="Travelers" value={2} />
          <CheckboxInput label="Share itinerary with team" defaultChecked />
        </div>
        <TextareaInput label="Notes" placeholder="Visa requirements, rail passes, accessibility…" />
      </div>
    </section>
  );
}
