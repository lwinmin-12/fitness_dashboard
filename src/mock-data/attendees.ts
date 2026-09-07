export interface Attendee { id: string; name: string; email: string; payment: 'One-time' | 'Package' | 'Membership'; status: 'Booked' | 'Checked-in' | 'Cancelled' | 'No-show' }
const names = ['Olivia Rhye', 'Phoenix Baker', 'Lana Steiner', 'Demi Wilkinson', 'Drew Cano', 'Natali Craig', 'Orlando Diggs', 'Andi Lane', 'Kate Morrison', 'Sophie Moore', 'Alex Morgan', 'Sam Taylor', 'Jamie Chen', 'Robin Lee', 'Charlie Kim', 'Avery Scott', 'Jordan Davis', 'Casey Wilson', 'Riley Brooks', 'Morgan Quinn'];
export function makeAttendees(id: string, count: number): Attendee[] { return Array.from({ length: count }, (_, i) => ({ id: `${id}-${i}`, name: names[i % names.length], email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`, payment: (['Membership', 'Package', 'One-time'] as const)[i % 3], status: i < 3 ? 'Checked-in' : 'Booked' })); }
export async function fetchAttendees(id: string, count: number, fail = false): Promise<Attendee[]> {
  await new Promise(resolve => setTimeout(resolve, 1400));
  if (fail) throw new Error('We couldn’t retrieve the guest list. Please try again.');
  return makeAttendees(id, count);
}
