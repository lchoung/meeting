package com.requiris.meetingapp;

import android.support.v7.app.ActionBarActivity;
import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.SystemClock;
import android.view.Menu;
import android.view.MenuItem;
import android.content.Intent;
import android.view.View;
import android.widget.TextView;
import android.widget.Button;


public class MainActivity extends ActionBarActivity {

	private Button startButton;
	private Button timeButton;
	private TextView timerValue;

	private long startTime = 0L;
	private Handler customHandler = new Handler();
	long timeInMilliseconds = 0L;
	long timeSwapBuff = 0L;
	long updatedTime = 0L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

		timerValue = (TextView) findViewById(R.id.timerValue);
		startButton = (Button) findViewById(R.id.timerButton);
		timeButton = (Button) findViewById(R.id.printTimeButton);

	}

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

	public void startClock(View view) {
		startTime = SystemClock.uptimeMillis();
		customHandler.postDelayed(updateTimerThread, 0);
	}

	public void printTime(View view) {
		int secs = (int) (updatedTime / 1000);
		int mins = secs / 60;
		secs = secs % 60;
		int milliseconds = (int) (updatedTime % 1000);
		timerValue.setText("" + mins + ":"
				+ String.format("%02d", secs) + ":"
				+ String.format("%03d", milliseconds));
	}


	private Runnable updateTimerThread = new Runnable() {

		public void run() {

			timeInMilliseconds = SystemClock.uptimeMillis() - startTime;

			updatedTime = timeSwapBuff + timeInMilliseconds;

			customHandler.postDelayed(this, 0);
		}

	};
}
