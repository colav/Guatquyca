/*
 * F126 (D-268): guard against the PolygonLayer exception of @antv/l7-layers 2.23.2.
 *
 * Cause (measured, F126): the source of the layer finishes its asynchronous parse of the GeoJSON («inited») before the scene
 * has loaded and the layer has been initialised, so `BaseLayer.processRelativeCoordinates()` asks the config service for the
 * layer config and gets `undefined` («Cannot read properties of undefined (reading 'enableRelativeCoordinates')»). The data
 * of the map do not change in the meantime, so no way of creating the map from the outside avoids that order of events.
 *
 * The method does nothing unless `enableRelativeCoordinates` is on (it is off by default and no map of the site turns it on),
 * so returning when the config does not exist yet is the same behaviour without the exception. The package and its version
 * are not touched; this is a runtime guard on the prototype, applied once.
 */
const GUARDED = Symbol.for("guatquyca.l7.processRelativeCoordinates.guarded");

/**
 * @param {{ BaseLayer?: Function }} l7Layers - The module `@antv/l7-layers` (the same copy that `@ant-design/maps` uses).
 * @returns {boolean} true when the guard is in place (now or before).
 */
export function guardRelativeCoordinates(l7Layers) {
  const proto = l7Layers?.BaseLayer?.prototype;
  if (!proto || typeof proto.processRelativeCoordinates !== "function") return false;
  if (proto.processRelativeCoordinates[GUARDED]) return true;
  const original = proto.processRelativeCoordinates;
  const guarded = function processRelativeCoordinatesGuarded(...args) {
    if (!this.getLayerConfig()) return undefined;
    return original.apply(this, args);
  };
  guarded[GUARDED] = true;
  proto.processRelativeCoordinates = guarded;
  return true;
}

/** Is this error one of the map libraries (by its stack)? Used to send it to the error boundary of the map. */
export const isMapLibraryError = (error) => /@antv\/l7|@ant-design\/maps|l7plot/i.test(String(error?.stack || ""));
