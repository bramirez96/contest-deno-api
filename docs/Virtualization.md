# Docker and Virtualization

If you are new to docker there are a few steps you need to take in order to run docker properly.
If you try running docker and get a message regarding virtualization followed by a strange link you will need to do the following:

## Windows

### A. First you will need to reset your machine through recovery mode

`Windows key > Settings > Update & Security > Recovery > Restart Now`.

When your PC restarts open Click on Troubleshoot > Advanced Options > Select UEFI Firmware Settings > Click Restart.

### B. Navigate to your machines BIOS settings

Step A will restart your machine and bring you to your BIOS settings. No matter what type of CPU you have you will find a `SVM Mode` that you need to **enable**. For me, this setting was under my BIOS `Advanced Settings` > CPU Config section.
Once you have **enabled** the SVM Mode you can Save & Reset your machine.

## Final Steps

Open your taks manager after your machine restarts and open your task manager: CTRL + Shift + ESC.
Open the performance tab and ensure that Virtualization is now **enabled**.

You should now have no issue starting Docker Desktop properly.
