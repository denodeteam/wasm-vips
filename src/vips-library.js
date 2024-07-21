var LibraryVips = {
  $VIPS__deps: [
#if ENVIRONMENT_MAY_BE_WEB
    '$ENV',
#endif
    '$ClassHandle',
    '$deletionQueue',
  ],
  $VIPS__postset: 'VIPS.init();',
  $VIPS: {
    init() {
#if ENVIRONMENT_MAY_BE_WEB
      addOnPreRun(() => {
        // Enforce a fixed thread pool by default on web
        ENV['VIPS_MAX_THREADS'] = {{{ PTHREAD_POOL_SIZE }}};
      });
#endif

      // Add preventAutoDelete method to ClassHandle
      Object.assign(ClassHandle.prototype, {
        'preventAutoDelete'() {
          const index = deletionQueue.indexOf(this);
          if (index > -1) {
            deletionQueue.splice(index, 1);
          }
          this.$$.deleteScheduled = false;
          return this;
        }
      });
    }
  }
}

addToLibrary(LibraryVips);
DEFAULT_LIBRARY_FUNCS_TO_INCLUDE.push('$VIPS');
