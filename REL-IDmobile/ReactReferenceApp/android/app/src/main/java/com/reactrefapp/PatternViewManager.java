package com.reactrefapp;

import android.content.Context;
import android.graphics.Color;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;

import com.eftimoff.patternview.PatternView;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.textinput.ReactTextInputManager;

import java.util.Map;

/**
 * Created by uniken on 22/8/16.
 */
public class PatternViewManager extends SimpleViewManager<ReactPatternView> {
    public static final String REACT_CLASS = "RCTPatternView";
    ReactPatternView view;
    public static final int COMMAND_GET_PATTERN = 1;
    public static final int COMMAND_CLEAR_PATTERN = 2;

   // public static final String EVENT_ON_GET_PATTERN = "onGetPattern";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ReactPatternView createViewInstance(ThemedReactContext reactContext) {
        view = new ReactPatternView(reactContext);
        return view;
        //ReactTextViewManager
    }

    @ReactProp(name = "pathColor")
    public void setPathColor(PatternView view,String colorHexCode){
        view.setPathColor(getColor(colorHexCode));
    }

    @ReactProp(name = "circleColor")
    public void setCircleColor(PatternView view,String colorHexCode){
        view.setCircleColor(getColor(colorHexCode));
    }

    @ReactProp(name = "dotColor")
    public void setDotColor(PatternView view,String colorHexCode){
        view.setDotColor(getColor(colorHexCode));
    }

    @ReactProp(name = "gridRows")
    public void setGridRows(PatternView view,String rows){
        try {
            int rowCount  =  Integer.parseInt(rows);
            view.setGridRows(rowCount);
        }
        catch (Exception e){}
    }

    @ReactProp(name = "gridColumns")
    public void setGridColumns(PatternView view,String columns){
        try {
            int columnsCount = Integer.parseInt(columns);
            view.setGridColumns(columnsCount);
        }
        catch (Exception e){}
    }

    @Override
    public Map<String,Integer> getCommandsMap() {
        Log.d("React", " View manager getCommandsMap:");
        return MapBuilder.of(
                "getPatternString", COMMAND_GET_PATTERN,
                "clearPattern",COMMAND_CLEAR_PATTERN);
    }

    @Override
    public void receiveCommand(
            ReactPatternView view,
            int commandType,
            @Nullable ReadableArray args) {
        Assertions.assertNotNull(view);
        Assertions.assertNotNull(args);
        switch (commandType) {
            case COMMAND_GET_PATTERN: {
                view.getPatternString();
                return;
            }

            case COMMAND_CLEAR_PATTERN: {
                view.clearPattern();
                return;
            }

            default:
                throw new IllegalArgumentException(String.format(
                        "Unsupported command %d received by %s.",
                        commandType,
                        getClass().getSimpleName()));
        }
    }

    private int getColor(String hex){
        int color;
        try {
            color = Color.parseColor(hex);
        }
        catch (IllegalArgumentException e){
            color = Color.WHITE;
        }

        return color;
    }

//    @javax.annotation.Nullable
//    @Override
//    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
//        return MapBuilder.<String, Object>builder()
//                .put(
//                        EVENT_ON_GET_PATTERN,
//                        MapBuilder.of(
//                                "phasedRegistrationNames",
//                                MapBuilder.of(
//                                        "bubbled", EVENT_ON_GET_PATTERN, "captured", EVENT_ON_GET_PATTERN + "Capture"))).build();
//    }

//    @Override
//    protected void addEventEmitters(final ThemedReactContext reactContext, final ReactPatternView view) {
//        super.addEventEmitters(reactContext, view);
//        view.addOnGetListener(new ReactPatternView.OnGetListener() {
//
//            EventDispatcher eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
//
//            @Override
//            public void onGet(String methodName, Object result) {
//                if (methodName.equals("getPatternString")) {
//                    eventDispatcher.dispatchEvent(new OnGetEvent(view.getId(),System.nanoTime(),(String)result,EVENT_ON_GET_PATTERN));
//                }
//            }
//        });
//    }

//    public class OnGetEvent extends Event<OnGetEvent>{
//        private final String eventName ;
//        String text = "";
//
//        public OnGetEvent(
//                int viewId,
//                long timestampMs,
//                String eventName,
//                String text) {
//            super(viewId, timestampMs);
//            this.eventName = eventName;
//            this.text = text;
//        }
//
//        @Override
//        public String getEventName() {
//            return eventName;
//        }
//
//        @Override
//        public void dispatch(RCTEventEmitter rctEventEmitter) {
//            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
//        }
//
//        private WritableMap serializeEventData() {
//            WritableMap eventData = Arguments.createMap();
//            eventData.putInt("target", getViewTag());
//            eventData.putString("text",text);
//            return eventData;
//        }
//    }
}
