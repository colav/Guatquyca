/* Components */
import APCTag from "../APCTag/APCTag";
import OpenAccessStatus from "../../ClientSide/OpenAccessStatus/OpenAccessStatus";
import Waiver from "../Waiver/Waiver";

/**
 * OpenAccessSection component displays open access status, APC tag, and waiver information for a publication.
 *
 * @component
 * @param {{
 *   apc: { charges: number|null, [key: string]: any },
 *   open_access_status: any,
 *   waiver: { has_waiver: boolean, [key: string]: any }
 * }} props - The component props
 * @returns {JSX.Element} The rendered OpenAccessSection component
 */
export default function OpenAccessSection({ apc, open_access_status, waiver }) {
  return (
    <>
      <OpenAccessStatus status={open_access_status} />
      {apc.charges !== null && <APCTag apc={apc} />}
      {waiver.has_waiver && <Waiver waiver={waiver} />}
    </>
  );
}
