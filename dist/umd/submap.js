(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubMap = void 0;
    class SubMap {
        constructor() {
            this.all = new Map();
        }
        get(event) {
            var _a;
            return (_a = this.all.get(event)) !== null && _a !== void 0 ? _a : [];
        }
        add(event, ...items) {
            let list = this.all.get(event);
            if (list) {
                list.push(...items.filter((e) => (list === null || list === void 0 ? void 0 : list.includes(e)) != true));
            }
            else {
                this.all.set(event, [...items]);
            }
            return this;
        }
        remove(event, ...items) {
            const list = this.all.get(event);
            if (list) {
                for (const item of items) {
                    const index = list.indexOf(item);
                    if (index !== -1) {
                        list.splice(index, 1);
                    }
                }
            }
            return this;
        }
        removeAll(event) {
            this.all.delete(event);
            return this;
        }
    }
    exports.SubMap = SubMap;
});
