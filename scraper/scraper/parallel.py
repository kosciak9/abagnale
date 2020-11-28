import contextlib
import joblib
from joblib import Parallel, delayed
from tqdm.auto import tqdm


def parallel_map(function, iterable, num_jobs=32):
    with tqdm_joblib(tqdm(iterable)):
        pool = Parallel(n_jobs=num_jobs)
        return [
            site
            for site in pool(
                delayed(function)(item)
                for item in iterable
            )
            if site is not None
        ]


@contextlib.contextmanager
def tqdm_joblib(tqdm_object):    
    class TqdmBatchCompletionCallback(joblib.parallel.BatchCompletionCallBack):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

        def __call__(self, *args, **kwargs):
            tqdm_object.update(n=self.batch_size)
            return super().__call__(*args, **kwargs)

    old_batch_callback = joblib.parallel.BatchCompletionCallBack
    joblib.parallel.BatchCompletionCallBack = TqdmBatchCompletionCallback
    try:
        yield tqdm_object
    finally:
        joblib.parallel.BatchCompletionCallBack = old_batch_callback
        tqdm_object.close()
