package com.reactrefapp;

import android.content.Context;
import android.util.AttributeSet;

import com.eftimoff.patternview.PatternView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by uniken on 23/8/16.
 */
public class ReactPatternView extends PatternView implements PatternView.OnPatternDetectedListener{

    private OnGetListener listener;

    public ReactPatternView(Context context) {
        super(context);
    }

    public ReactPatternView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ReactPatternView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    public void addOnGetListener(OnGetListener listener){
        this.listener = listener;
    }

    @Override
    public String getPatternString() {
        String pattern = super.getPatternString();
//        if(listener!=null){
//            listener.onGet("getPatternString",pattern);
//        }

        WritableMap event = Arguments.createMap();
        event.putString("text", pattern);
        event.putInt("size",getPattern().size());
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "topChange", event);
        return pattern;
    }

    public ReactPatternView enablePatternDetection(boolean flag){
        if(flag) {
            setOnPatternDetectedListener(this);
        }

        return this;
    }

    @Override
    public void onPatternDetected() {
        getPatternString();
    }

    public interface OnGetListener{
        public void onGet(String methodName,Object result);
    }

}
