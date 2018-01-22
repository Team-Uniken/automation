package com.uniken.poc.rpocwallet.ModelsAndHolders;

import android.util.Log;

import com.uniken.rdna.RDNA;

import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class PauseResumeLock
{
  private ReadWriteLock rwLock = new ReentrantReadWriteLock();
  private RDNA.RDNAMethodID lastMethodId;
  private RDNA.RDNAMethodID currentMethodId;

  public void setLastMethodId(RDNA.RDNAMethodID methodID)
  {
    rwLock.writeLock().lock();
    try {
      lastMethodId = methodID;
      if (methodID != null) {
        Log.e("PauseResumeLock", "------------- setLastMethodId = " + methodID.name());
      }
      else {
        Log.e("PauseResumeLock", "-------------- setLastMethodId = null");
      }
    }
    finally {
      rwLock.writeLock().unlock();
    }
  }

  public void setCurrentMethodId(RDNA.RDNAMethodID methodID)
  {
    rwLock.writeLock().lock();
    try {
      currentMethodId = methodID;
      if (methodID != null) {
        Log.e("PauseResumeLock", "---------------- setCurrentMethodId = " + methodID.name());
      }
      else {
        Log.e("PauseResumeLock", "---------------- setCurrentMethodId = null");
      }
    }
    finally {
      rwLock.writeLock().unlock();
    }
  }

  public RDNA.RDNAMethodID getLastMethodId()
  {
    rwLock.readLock().lock();
    try {
      return lastMethodId;
    }
    finally {
      rwLock.readLock().unlock();
    }
  }

  public RDNA.RDNAMethodID getCurrentMethodId()
  {
    rwLock.readLock().lock();
    try {
      return currentMethodId;
    }
    finally {
      rwLock.readLock().unlock();
    }
  }
}
