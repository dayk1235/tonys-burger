export var GraphSyncEvent;
(function (GraphSyncEvent) {
    GraphSyncEvent["FileChanged"] = "file:changed";
    GraphSyncEvent["BatchReady"] = "batch:ready";
    GraphSyncEvent["IndexStarted"] = "index:started";
    GraphSyncEvent["IndexFinished"] = "index:finished";
    GraphSyncEvent["IndexFailed"] = "index:failed";
    GraphSyncEvent["ProviderUnavailable"] = "provider:unavailable";
    GraphSyncEvent["ProviderAvailable"] = "provider:available";
    GraphSyncEvent["SyncSkipped"] = "sync:skipped";
    GraphSyncEvent["Error"] = "error";
})(GraphSyncEvent || (GraphSyncEvent = {}));
//# sourceMappingURL=events.js.map